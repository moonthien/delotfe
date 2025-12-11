import React, { useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled from "styled-components";

const ItemTypes = {
  DECORATION: "decoration",
};

const DropSpot = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props) =>
    props.$hasItem ? "none" : "2px dashed rgba(255,255,255,0.6)"};
  background: ${(props) =>
    props.$isOver ? "rgba(255,255,255,0.3)" : "transparent"};
  transition: 0.2s;
`;

const DropImage = styled.img`
  width: 70px;
  height: 70px;
  pointer-events: none;
`;

export const CustomDragLayer = () => {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  if (!isDragging || !item || !currentOffset || !item.reward?.rewardId?.image) return null;

  const { x, y } = currentOffset;
  const reward = item.reward;

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        left: 0,
        top: 0,
        zIndex: 9999,
        transform: `translate(${x - 30}px, ${y - 30}px)`, // căn giữa ảnh
      }}
    >
      <img
        src={
          reward?.rewardId?.image ||
          "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
        }
        alt={reward?.rewardId?.name || "Phần thưởng"}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          opacity: 0.9,
        }}
      />
    </div>
  );
};

export const DraggableDecoration = ({ reward, disabled }) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.DECORATION,
      item: disabled ? null : { reward },
      canDrag: !disabled, // ⛔ Không cho kéo nếu disabled
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [disabled]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      style={{
        textAlign: "center",
        opacity: disabled ? 0.4 : isDragging ? 0.5 : 1, // 👈 Mờ nếu đã hết
        cursor: disabled ? "not-allowed" : "grab",
        userSelect: "none",
      }}
    >
      <img
        ref={disabled ? null : drag}
        draggable={!disabled}
        src={
          reward.rewardId?.image ||
          "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
        }
        alt={reward.rewardId?.name || "Phần thưởng"}
        title={
          disabled
            ? "Đã dùng hết phần quà này 🎄"
            : reward.rewardId?.name || "Phần thưởng"
        }
        style={{
          width: 60,
          height: 60,
          objectFit: "contain",
          transition: "opacity 0.2s",
        }}
      />
      <p
        style={{
          fontSize: "12px",
          color: "#333",
          marginTop: "4px",
          fontFamily: "Montserrat-SemiBold, sans-serif",
        }}
      >
        {reward.rewardId?.name || "Không xác định"}
      </p>
    </div>
  );
};

export const DropZone = ({ position, placedItem, onDrop, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.DECORATION,
    drop: (item) => onDrop(position, item.reward),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (!placedItem) {
    return <DropSpot ref={drop} style={position} $isOver={isOver} $hasItem={false} hidden={isOver}/>;
  }

  const reward =
    placedItem.rewardId?.image
      ? placedItem.rewardId
      : placedItem.reward?.rewardId
      ? placedItem.reward.rewardId
      : placedItem.rewardId || {};

  const imageSrc =
    reward.image ||
    placedItem.image ||
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

  const imageAlt = reward.name || placedItem.name || "Phần thưởng";

  return (
    <DropSpot ref={drop} style={position} $isOver={isOver} $hasItem={true}>
      <DropImage src={imageSrc} alt={imageAlt} title={imageAlt} />
      {placedItem._id && (
        <button
          onClick={() => onRemove(placedItem._id)}
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            background: "rgba(255,0,0,0.8)",
            border: "none",
            borderRadius: "50%",
            color: "white",
            cursor: "pointer",
            width: "20px",
            height: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ×
        </button>
      )}
    </DropSpot>
  );
};