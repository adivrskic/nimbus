import { useState, useEffect, useCallback } from "react";
import { X, Loader, ExternalLink, CreditCard } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import useModalAnimation from "../../hooks/useModalAnimation";

import "../../styles/modals.scss";
function BillingModal({ isOpen, onClose }) {
  const { user, profile, supabase, isAuthenticated } = useAuth();
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  useEffect(() => {
    if (isOpen && user) {
      loadSites();
    }
  }, [isOpen, user]);

  useEffect(() => {
    calculateBillingSummary();
  }, [sites]);

  const loadSites = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error("Error loading sites:", error);
      setSites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBillingSummary = useCallback(() => {
    const activeSites = sites.filter(
      (site) => site.billing_status === "active" && !site.cancelled_at
    );

    const trialSites = sites.filter((site) => site.billing_status === "trial");

    const cancelledButActive = sites.filter(
      (site) =>
        site.cancelled_at &&
        site.current_period_end &&
        new Date(site.current_period_end) > new Date()
    );

    const activeSiteCost = activeSites.length * 500;
    const cancelledSiteCost = cancelledButActive.length * 500;
    const totalMonthlyCostCents = activeSiteCost + cancelledSiteCost;

    const summary = {
      total_sites: sites.length,
      active_sites: activeSites.length,
      trial_sites: trialSites.length,
      cancelled_but_active: cancelledButActive.length,
      total_monthly_cost_cents: totalMonthlyCostCents,
    };

    setBillingSummary(summary);
    return summary;
  }, [sites]);

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const handleOpenStripePortal = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            userId: user.id,
            returnUrl: window.location.href,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to create portal session");
      }

      if (data?.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      setNotification({
        isOpen: true,
        message:
          error.message ||
          "Failed to open billing portal. Please try again or contact support.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!shouldRender || !isAuthenticated) return null;

  return (
    <>
      <div
        className={`modal-overlay ${isVisible ? "active" : ""}`}
        onClick={onClose}
      >
        <div
          className={`modal-content modal-content--sm modal-content--surface modal-content--centered ${
            isVisible ? "active" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <span className="modal-title">
              <CreditCard size={16} />
              <span>Billing</span>
            </span>
            <button className="modal-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="modal-loading">
              <Loader size={16} className="spinning" />
            </div>
          ) : billingSummary ? (
            <div className="billing-breakdown">
              <div className="billing-item">
                <span>Total sites</span>
                <span>{billingSummary.total_sites}</span>
              </div>
              <div className="billing-item">
                <span>Active sites</span>
                <span>{billingSummary.active_sites}</span>
              </div>
              {billingSummary.trial_sites > 0 && (
                <div className="billing-item">
                  <span>Trial sites</span>
                  <span>{billingSummary.trial_sites}</span>
                </div>
              )}
              <div className="billing-item billing-item--total">
                <span>Monthly total</span>
                <span>
                  {formatCurrency(billingSummary.total_monthly_cost_cents)}
                </span>
              </div>
            </div>
          ) : null}

          <div className="modal-note">$5.00 per site per month</div>

          {profile?.stripe_customer_id && (
            <>
              {" "}
              <button
                className="modal-btn-primary"
                onClick={handleOpenStripePortal}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader size={14} className="spinning" />
                ) : (
                  <>
                    <ExternalLink size={14} />
                    Manage Billing
                  </>
                )}
              </button>
              <span className="modal-note">Billing managed by Stripe</span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BillingModal;
