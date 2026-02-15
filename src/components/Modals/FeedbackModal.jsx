// components/Modals/FeedbackModal/FeedbackModal.jsx
import { useState } from "react";
import {
  X,
  ThumbsUp,
  ThumbsDown,
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import useModalAnimation from "../../hooks/useModalAnimation";
import { supabase } from "../../lib/supabaseClient";
import "./modals.scss";

function FeedbackModal({
  isOpen,
  onClose,
  // lastRequest: { type: 'initial' | 'enhancement', prompt: string }
  lastRequest,
  selections,
  generatedCode,
  originalPrompt,
}) {
  const { user, isAuthenticated } = useAuth();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [rating, setRating] = useState(null); // 'up' or 'down'
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Determine what to show based on last request type
  const isInitialGeneration = lastRequest?.type === "initial";
  const requestPrompt = lastRequest?.prompt || originalPrompt || "";

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const feedbackData = {
        user_id: user?.id || null,
        rating: rating === "up" ? 1 : -1,
        comment: comment.trim() || null,
        request_type: lastRequest?.type || "initial",
        request_prompt: requestPrompt || null,
        original_prompt: originalPrompt || null,
        selections: selections || {},
        html_preview: generatedCode ? generatedCode.substring(0, 5000) : null,
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        },
      };

      const { error: submitError } = await supabase
        .from("feedback")
        .insert(feedbackData);

      if (submitError) throw submitError;

      setIsSubmitted(true);

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(null);
      setComment("");
      setError("");
      setIsSubmitted(false);
      closeModal();
    }
  };

  // Format selections for display
  const getActiveSelections = () => {
    if (!selections) return [];

    return Object.entries(selections)
      .filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object" && value !== null)
          return Object.keys(value).length > 0;
        return value !== null && value !== undefined;
      })
      .map(([key, value]) => {
        let displayValue = value;
        if (Array.isArray(value)) {
          displayValue =
            value.length === 1 ? value[0] : `${value.length} selected`;
        } else if (typeof value === "object") {
          displayValue = "Custom";
        }
        return {
          key:
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/([A-Z])/g, " $1"),
          value: displayValue,
        };
      });
  };

  if (!shouldRender) return null;

  const activeSelections = getActiveSelections();

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isSubmitted ? (
          <div className="feedback-success">
            <CheckCircle size={48} className="feedback-success__icon" />
            <h3 className="feedback-success__title">Thank you!</h3>
            <p className="feedback-success__message">
              Your feedback helps us improve.
            </p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-title">
                <MessageSquare size={16} />
                <span>
                  {isInitialGeneration ? "Generation" : "Enhancement"} Feedback
                </span>
              </div>
              <button
                className="modal-close"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-subtitle">
              How was this {isInitialGeneration ? "generation" : "enhancement"}?
            </div>

            <div className="feedback-body">
              {/* Request prompt display */}
              {requestPrompt && (
                <div className="feedback-section">
                  <label className="feedback-label">
                    {isInitialGeneration
                      ? "Original Prompt"
                      : "Enhancement Request"}
                  </label>
                  <div className="feedback-prompt-display">
                    "{requestPrompt}"
                  </div>
                </div>
              )}

              {/* Active selections display - only show for initial generations */}
              {isInitialGeneration && activeSelections.length > 0 && (
                <div className="feedback-section">
                  <label className="feedback-label">Selected Options</label>
                  <div className="feedback-selections">
                    {activeSelections.map(({ key, value }) => (
                      <div key={key} className="feedback-selection-item">
                        <span className="feedback-selection-key">{key}</span>
                        <span className="feedback-selection-value">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating section */}
              <div className="feedback-section">
                <label className="feedback-label">Rating</label>
                <div className="feedback-rating">
                  <button
                    className={`feedback-rating-btn ${
                      rating === "up" ? "active up" : ""
                    }`}
                    onClick={() => setRating("up")}
                    disabled={isSubmitting}
                    type="button"
                  >
                    <ThumbsUp size={20} />
                    <span>Good</span>
                  </button>
                  <button
                    className={`feedback-rating-btn ${
                      rating === "down" ? "active down" : ""
                    }`}
                    onClick={() => setRating("down")}
                    disabled={isSubmitting}
                    type="button"
                  >
                    <ThumbsDown size={20} />
                    <span>Needs Work</span>
                  </button>
                </div>
              </div>

              {/* Comment section */}
              <div className="feedback-section">
                <label className="feedback-label">
                  Comments <span className="optional">(optional)</span>
                </label>
                <textarea
                  className="feedback-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what worked well or what could be improved..."
                  rows={4}
                  disabled={isSubmitting}
                  maxLength={1000}
                />
                <div className="feedback-char-count">{comment.length}/1000</div>
              </div>

              {error && <div className="modal-error">{error}</div>}

              <button
                className="modal-btn-primary modal-btn-primary--pill"
                onClick={handleSubmit}
                disabled={isSubmitting || !rating}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <p className="modal-note">
                  Submitting anonymously. Sign in to help us better understand
                  your feedback.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FeedbackModal;
