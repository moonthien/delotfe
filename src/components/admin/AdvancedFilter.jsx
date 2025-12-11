import React from "react";
import styled from "styled-components";
import { Plus, Search } from "lucide-react";

const FilterSection = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.2);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%,
    100% {
      background-position: 200% center;
    }
    50% {
      background-position: -200% center;
    }
  }
`;

const FilterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.gridColumns || "2fr repeat(auto-fit, minmax(200px, 1fr))"};
  gap: 16px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  margin-top: 8px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #667eea;
  transition: all 0.3s ease;
  z-index: 2;
  pointer-events: none;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }

  &:hover:not(:disabled) {
    border-color: rgba(102, 126, 234, 0.4);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:disabled {
    background: rgba(249, 250, 251, 0.7);
    color: #9ca3af;
    cursor: not-allowed;
    border-color: rgba(209, 213, 219, 0.3);
    opacity: 0.6;
  }

  option {
    padding: 8px;
    font-weight: 500;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    filter: brightness(1.1);
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
    transition: all 0.1s ease;
  }
`;

const ClearFiltersButton = styled.button`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #6b7280;
  border: 2px solid rgba(148, 163, 184, 0.2);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: rgba(102, 126, 234, 0.4);
    color: #374151;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    transition: all 0.1s ease;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AdvancedFilter = ({
  searchConfig,
  filterConfigs = [],
  onClearFilters,
  addButtonConfig,
  gridColumns,
  className,
}) => {
  // Calculate grid columns for filters only (excluding actions)
  const calculateGridColumns = () => {
    if (gridColumns) return gridColumns;

    const searchCols = searchConfig ? 1 : 0;
    const filterCols = filterConfigs.length;

    // Create responsive grid template
    const cols = [];
    if (searchCols) cols.push("2fr");
    for (let i = 0; i < filterCols; i++) {
      cols.push("1fr");
    }

    return cols.join(" ");
  };

  return (
    <FilterSection className={className}>
      <FilterContent>
        {/* Search and Filters Row */}
        <FilterRow gridColumns={calculateGridColumns()}>
          {/* Search Field */}
          {searchConfig && (
            <FilterGroup>
              <FilterLabel>{searchConfig.label}</FilterLabel>
              <SearchWrapper>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder={searchConfig.placeholder}
                  value={searchConfig.value}
                  onChange={(e) => searchConfig.onChange(e.target.value)}
                />
              </SearchWrapper>
            </FilterGroup>
          )}

          {/* Dynamic Filter Selects */}
          {filterConfigs.map((config, index) => (
            <FilterGroup key={index}>
              <FilterLabel>{config.label}</FilterLabel>
              <FilterSelect
                value={config.value}
                onChange={(e) => config.onChange(e.target.value)}
                disabled={config.disabled}
              >
                {/* Chỉ hiển thị option placeholder nếu placeholder không rỗng */}
                {config.placeholder !== "" && (
                  <option value="">
                    {config.placeholder ||
                      `Tất cả ${config.label.toLowerCase()}`}
                  </option>
                )}
                {config.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          ))}
        </FilterRow>

        {/* Action Buttons Row */}
        {(addButtonConfig || onClearFilters) && (
          <ActionRow>
            {addButtonConfig && (
              <AddButton onClick={addButtonConfig.onClick}>
                <Plus /> {addButtonConfig.text}
              </AddButton>
            )}
            {onClearFilters && (
              <ClearFiltersButton onClick={onClearFilters}>
                🗑️ Xóa bộ lọc
              </ClearFiltersButton>
            )}
          </ActionRow>
        )}
      </FilterContent>
    </FilterSection>
  );
};

export default AdvancedFilter;
