import React from "react";
import styled from "styled-components";
import TablePagination from "./user/TablePagination";

// Wrapper cho table responsive với horizontal scroll
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;

  /* Ensure smooth scrolling */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #cbd5e1, #94a3b8);
    border-radius: 4px;

    &:hover {
      background: linear-gradient(135deg, #94a3b8, #64748b);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    border-radius: 8px;

    &::-webkit-scrollbar {
      height: 6px;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin: 0 -8px;
    border-radius: 0;
  }
`;

// Table tùy chỉnh cho sử dụng chung
const CustomTable = styled.table`
  width: 100%;
  table-layout: auto;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  min-width: 1000px;

  thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  th {
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    color: white;
    font-size: 14px;
    letter-spacing: 0.5px;
    white-space: nowrap;
    vertical-align: middle;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &.sortable {
      cursor: pointer;
      user-select: none;

      &::after {
        content: "↕️";
        margin-left: 8px;
        opacity: 0.6;
        font-size: 12px;
        transition: opacity 0.2s ease;
      }

      &.sort-asc::after {
        content: "🔼";
        opacity: 1;
      }

      &.sort-desc::after {
        content: "🔽";
        opacity: 1;
      }

      &:hover::after {
        opacity: 1;
      }
    }

    &:first-child {
      border-top-left-radius: 12px;
    }

    &:last-child {
      border-top-right-radius: 12px;
    }
  }

  tbody tr {
    background: white;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:nth-child(even) {
      background: #fafbfc;
    }

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.05),
        rgba(118, 75, 162, 0.05)
      );
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    }
  }

  td {
    padding: 16px 12px;
    color: #374151;
    vertical-align: middle;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* Allow text wrapping for specific content */
    &.wrap-text {
      white-space: normal;
      word-break: break-word;
      overflow: visible;
      text-overflow: unset;
    }
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${(props) => {
    switch (props.variant) {
      case "edit":
        return "linear-gradient(135deg, #667eea, #764ba2)";
      case "delete":
        return "linear-gradient(135deg, #ff6b6b, #feca57)";
      case "view":
        return "linear-gradient(135deg, #00d4aa 0%, #00a3ff 50%, #667eea 100%)";
      case "primary":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      default:
        return "linear-gradient(135deg, #6b7280, #9ca3af)";
    }
  }};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: fit-content;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 11px;
    gap: 2px;
  }
`;

// Component Badge cho hiển thị trạng thái
const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  ${(props) => {
    switch (props.variant) {
      case "success":
        return `
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        `;
      case "danger":
        return `
          background: linear-gradient(135deg, #c75959ff, #e81f1fd8);
          color: white;
        `;
      case "warning":
        return `
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        `;
      case "info":
        return `
          background: linear-gradient(135deg, #3b82f6, #4b7de8d2);
          color: white;
        `;
      case "primary":
        return `
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        `;
      default:
        return `
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          color: white;
        `;
    }
  }}
`;

// Nút đặc biệt để xem học sinh
const ViewStudentsButton = styled.button`
  background: linear-gradient(135deg, #00d4aa 0%, #00a3ff 50%, #667eea 100%);
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 10px;
  }
`;

// Component Generic Table
const GenericTable = ({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  emptyMessage = "Không có dữ liệu",
  showSTT = true,
  pagination = null,
  sorting = null,
  className = "",
  additionalProps = {},
}) => {
  // Hàm render header với sorting
  const renderSortableHeader = (column, index) => {
    const isSortable = sorting && column.accessor;
    const isCurrentSort = sorting?.sortField === column.accessor;
    const sortClass = isCurrentSort ? `sort-${sorting.sortDirection}` : "";

    const handleHeaderClick = () => {
      if (isSortable && sorting.onSort) {
        sorting.onSort(column.accessor);
      }
    };

    return (
      <th
        key={index}
        style={{
          width: column.width,
          minWidth: column.minWidth || column.width,
          maxWidth: column.width,
        }}
        className={isSortable ? `sortable ${sortClass}` : ""}
        onClick={handleHeaderClick}
        title={isSortable ? `Sắp xếp theo ${column.header}` : undefined}
      >
        {column.header}
      </th>
    );
  };

  // Hàm lấy STT (số thứ tự)
  const getSTT = (index) => {
    if (pagination) {
      return (pagination.currentPage - 1) * pagination.itemsPerPage + index + 1;
    }
    return index + 1;
  };

  // Hàm lấy giá trị nested từ object sử dụng dot notation
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  // Hàm render nội dung cell
  const renderCellContent = (row, column) => {
    const rawValue = column.accessor.includes(".")
      ? getNestedValue(row, column.accessor)
      : row[column.accessor];

    // Nếu column có hàm render tùy chỉnh
    if (column.render) {
      return column.render(rawValue, row, additionalProps);
    }

    // Áp dụng hàm format nếu có
    if (column.format) {
      return column.format(rawValue);
    }

    return rawValue ?? "N/A";
  };

  // Render các nút hành động
  const renderActions = (row, index) => {
    if (!actions || actions.length === 0) return null;

    return (
      <ActionGroup>
        {actions.map((action, actionIndex) => {
          // Kiểm tra xem action có hiển thị không
          if (action.show && !action.show(row)) {
            return null;
          }

          // Kiểm tra xem action có bị vô hiệu hóa không
          const isDisabled = action.disabled ? action.disabled(row) : false;

          const label =
            typeof action.label === "function"
              ? action.label(row)
              : action.label;
          const title =
            action.title || (typeof label === "string" ? label : "Action");

          // Sử dụng ViewStudentsButton đặc biệt cho view variant
          if (action.variant === "view") {
            return (
              <ViewStudentsButton
                key={actionIndex}
                onClick={() => !isDisabled && action.onClick(row, index)}
                title={title}
                disabled={isDisabled}
              >
                {label}
              </ViewStudentsButton>
            );
          }

          return (
            <ActionButton
              key={actionIndex}
              variant={action.variant}
              onClick={() => !isDisabled && action.onClick(row, index)}
              title={title}
              disabled={isDisabled}
            >
              {label}
            </ActionButton>
          );
        })}
      </ActionGroup>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
        <div>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <TableWrapper>
        <CustomTable>
          <thead>
            <tr>
              {showSTT && (
                <th
                  style={{ width: "60px", minWidth: "60px", maxWidth: "60px" }}
                >
                  STT
                </th>
              )}
              {columns.map((col, index) => renderSortableHeader(col, index))}
              {actions && actions.length > 0 && (
                <th
                  style={{
                    width: "120px",
                    minWidth: "120px",
                    maxWidth: "120px",
                    textAlign: "center",
                  }}
                >
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row._id || row.id || index}>
                {showSTT && (
                  <td
                    style={{
                      width: "60px",
                      minWidth: "60px",
                      maxWidth: "60px",
                    }}
                  >
                    {getSTT(index)}
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      width: col.width,
                      minWidth: col.minWidth || col.width,
                      maxWidth: col.width,
                    }}
                  >
                    {renderCellContent(row, col)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td
                    style={{
                      width: "120px",
                      minWidth: "120px",
                      maxWidth: "120px",
                    }}
                  >
                    {renderActions(row, index)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </CustomTable>
      </TableWrapper>

      {pagination && (
        <TablePagination
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          onItemsPerPageChange={pagination.onItemsPerPageChange}
        />
      )}
    </div>
  );
};

// Export Badge component để sử dụng bên ngoài
export { Badge };
export default GenericTable;
