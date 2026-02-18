// components/Home/ActivePills/ActivePills.jsx - Display active selection pills
import { X } from "lucide-react";
import "./ActivePills.scss";

function ActivePills({ categories, onPillClick, onResetClick }) {
  if (categories.length === 0) return null;

  return (
    <div className="active-pills">
      {categories.map((cat) => (
        <button
          key={cat.key}
          className="active-pills__pill"
          onClick={() => onPillClick(cat.key)}
        >
          <span className="active-pills__label">{cat.label}</span>
          <span className="active-pills__value">{cat.value}</span>
          <span
            className="active-pills__close"
            onClick={(e) => {
              e.stopPropagation();
              onResetClick(cat.key);
            }}
          >
            <X size={12} />
          </span>
        </button>
      ))}
    </div>
  );
}

export default ActivePills;
