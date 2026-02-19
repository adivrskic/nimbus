import { useState } from "react";

const MOCK_CATEGORIES = [
  {
    key: "layout",
    label: "Layout",
    icon: "⊞",
    group: "layout",
    selected: true,
    value: "Single Page",
  },
  {
    key: "palette",
    label: "Color Palette",
    icon: "◐",
    group: "visual",
    selected: true,
    value: "Ocean",
  },
  {
    key: "typography",
    label: "Typography",
    icon: "Aa",
    group: "visual",
    selected: false,
  },
  {
    key: "style",
    label: "Visual Style",
    icon: "◆",
    group: "visual",
    selected: false,
  },
  {
    key: "animation",
    label: "Animations",
    icon: "↻",
    group: "visual",
    selected: false,
  },
  {
    key: "sections",
    label: "Sections",
    icon: "☰",
    group: "content",
    selected: true,
    value: "Hero, About, CTA",
  },
  {
    key: "tone",
    label: "Tone of Voice",
    icon: "♪",
    group: "content",
    selected: false,
  },
  {
    key: "imagery",
    label: "Image Style",
    icon: "▣",
    group: "visual",
    selected: false,
  },
  {
    key: "nav",
    label: "Navigation",
    icon: "≡",
    group: "components",
    selected: false,
  },
  {
    key: "footer",
    label: "Footer Style",
    icon: "▬",
    group: "components",
    selected: false,
  },
  {
    key: "responsive",
    label: "Responsive",
    icon: "▢",
    group: "technical",
    selected: true,
    value: "All Devices",
  },
  {
    key: "framework",
    label: "Framework",
    icon: "⟨⟩",
    group: "technical",
    selected: false,
  },
];

const MOCK_CHOICES = [
  "Single Page",
  "Multi Page",
  "Landing",
  "Portfolio",
  "Blog",
  "SaaS",
  "E-commerce",
  "Dashboard",
];

const BRAND_FIELDS = {
  identity: [
    {
      key: "branding.brandName",
      label: "Brand Name",
      placeholder: "e.g., Acme Inc",
      half: true,
    },
    {
      key: "branding.tagline",
      label: "Tagline",
      placeholder: "e.g., Innovation delivered",
      half: true,
    },
    {
      key: "business.description",
      label: "Description",
      placeholder: "Brief description of your business",
      full: true,
    },
    {
      key: "business.location",
      label: "Location",
      placeholder: "e.g., San Francisco, CA",
      half: true,
    },
    {
      key: "business.yearEstablished",
      label: "Year Est.",
      placeholder: "e.g., 2020",
      small: true,
    },
  ],
  contact: [
    {
      key: "contactInfo.email",
      label: "Email",
      placeholder: "contact@example.com",
      half: true,
    },
    {
      key: "contactInfo.phone",
      label: "Phone",
      placeholder: "+1 (555) 123-4567",
      half: true,
    },
    {
      key: "contactInfo.address",
      label: "Address",
      placeholder: "123 Main St, City, State",
      full: true,
    },
  ],
  social: [
    {
      key: "socialMedia.twitter",
      label: "Twitter",
      placeholder: "https://twitter.com/...",
      half: true,
    },
    {
      key: "socialMedia.instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/...",
      half: true,
    },
    {
      key: "socialMedia.linkedIn",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/...",
      half: true,
    },
    {
      key: "socialMedia.facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/...",
      half: true,
    },
  ],
  content: [
    {
      key: "content.primaryCta",
      label: "Primary CTA",
      placeholder: "e.g., Get Started",
      half: true,
    },
    {
      key: "content.copyrightText",
      label: "Copyright",
      placeholder: "e.g., © 2025 Company",
      half: true,
    },
  ],
};

export default function OptionsModalPreview() {
  const [activeTab, setActiveTab] = useState("design");
  const [activeOption, setActiveOption] = useState(null);
  const [filter, setFilter] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("Single Page");
  const [brandValues, setBrandValues] = useState({});

  const filters = [
    "",
    "layout",
    "visual",
    "content",
    "components",
    "technical",
  ];
  const filtered = filter
    ? MOCK_CATEGORIES.filter((c) => c.group === filter)
    : MOCK_CATEGORIES;
  const selectedCount = MOCK_CATEGORIES.filter((c) => c.selected).length;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#0c0c0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          width: "95%",
          maxWidth: 920,
          height: "88vh",
          background: "#141416",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gap: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 22px 0",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#888", fontSize: 15 }}>⚙</span>
            <span style={{ color: "#e0e0e0", fontSize: 14, fontWeight: 600 }}>
              Customize
            </span>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "14px 22px 0",
            flexShrink: 0,
          }}
        >
          {["design", "brand"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setActiveOption(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: activeTab === tab ? "#fff" : "transparent",
                border: "none",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                color: activeTab === tab ? "#111" : "#888",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab === "design" ? "Design" : "Brand & Business"}
              {tab === "design" && selectedCount > 0 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background:
                      activeTab === tab
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.08)",
                    padding: "1px 6px",
                    borderRadius: 999,
                    color: activeTab === tab ? "#333" : "#aaa",
                  }}
                >
                  {selectedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: "16px 22px 22px",
            gap: 14,
          }}
        >
          {/* ======== DESIGN TAB ======== */}
          {activeTab === "design" && !activeOption && (
            <>
              {/* Filters */}
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                {filters.map((f) => (
                  <button
                    key={f || "all"}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "5px 11px",
                      background:
                        filter === f ? "rgba(255,255,255,0.08)" : "transparent",
                      border: "none",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 500,
                      color: filter === f ? "#ddd" : "#666",
                      cursor: "pointer",
                      textTransform: "capitalize",
                      transition: "all 0.15s",
                    }}
                  >
                    {f || "All"}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                  gap: 5,
                  alignContent: "start",
                }}
              >
                {filtered.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveOption(cat.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 10px",
                      background: cat.selected
                        ? "rgba(99,102,241,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: "none",
                      borderRadius: 10,
                      cursor: "pointer",
                      textAlign: "left",
                      height: 42,
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: cat.selected
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(255,255,255,0.04)",
                        borderRadius: 8,
                        fontSize: 13,
                        color: cat.selected ? "#818cf8" : "#888",
                        flexShrink: 0,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#e0e0e0",
                        }}
                      >
                        {cat.label}
                      </div>
                      {cat.selected && cat.value && (
                        <div
                          style={{
                            fontSize: 10.5,
                            color: "#888",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {cat.value}
                        </div>
                      )}
                    </div>
                    <span style={{ color: "#444", fontSize: 11 }}>›</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Design drill-down */}
          {activeTab === "design" && activeOption && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setActiveOption(null)}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.05)",
                    border: "none",
                    borderRadius: "50%",
                    color: "#aaa",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ‹
                </button>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 15, fontWeight: 600, color: "#e0e0e0" }}
                  >
                    {MOCK_CATEGORIES.find((c) => c.key === activeOption)?.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#666" }}>
                    Choose one option
                  </div>
                </div>
                <button
                  style={{
                    padding: "5px 10px",
                    background: "none",
                    border: "none",
                    fontSize: 11.5,
                    color: "#666",
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {MOCK_CHOICES.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => setSelectedChoice(choice)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 14px",
                      background:
                        selectedChoice === choice
                          ? "rgba(99,102,241,0.08)"
                          : "rgba(255,255,255,0.03)",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 12.5,
                      fontWeight: 500,
                      color: "#e0e0e0",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <span>{choice}</span>
                    {selectedChoice === choice && (
                      <span style={{ color: "#818cf8", fontSize: 12 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======== BRAND TAB ======== */}
          {activeTab === "brand" && (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 28,
                paddingRight: 4,
              }}
            >
              {Object.entries(BRAND_FIELDS).map(([section, fields]) => (
                <div
                  key={section}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {/* Section label */}
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {section}
                  </div>

                  {/* Fields */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          flex: field.full
                            ? "1 1 100%"
                            : field.small
                            ? "0 0 110px"
                            : "1 1 calc(50% - 4px)",
                          minWidth: field.small ? 110 : 0,
                          maxWidth: field.small ? 130 : "none",
                        }}
                      >
                        <label
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: "#777",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {field.label}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={brandValues[field.key] || ""}
                          onChange={(e) =>
                            setBrandValues((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "9px 11px",
                            background: brandValues[field.key]
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.025)",
                            border: "none",
                            borderRadius: 10,
                            fontSize: 13,
                            fontFamily: "inherit",
                            color: "#e0e0e0",
                            outline: "none",
                            transition: "background 0.15s, box-shadow 0.15s",
                            boxSizing: "border-box",
                          }}
                          onFocus={(e) => {
                            e.target.style.background =
                              "rgba(255,255,255,0.06)";
                            e.target.style.boxShadow =
                              "0 0 0 2px rgba(99,102,241,0.12)";
                          }}
                          onBlur={(e) => {
                            e.target.style.background = brandValues[field.key]
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.025)";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
