import React, { useState } from "react";
import styled from "styled-components";

// Form styles
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #00d4aa, #01a3a4);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 170, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

const GenericForm = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Lưu",
  cancelLabel = "Hủy",
  isLoading = false,
  initialData = {},
  validationRules = {},
  onFieldChange, // New prop for cascading field changes
}) => {
  const [formData, setFormData] = useState(() => {
    const initialFormData = {};
    fields.forEach((field) => {
      initialFormData[field.name] =
        initialData[field.name] || field.defaultValue || "";
    });
    return initialFormData;
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Check if there's a custom field change handler (for cascading effects)
    if (onFieldChange) {
      const updatedData = onFieldChange(name, newValue);
      if (updatedData && typeof updatedData === "object") {
        setFormData((prev) => ({
          ...prev,
          ...updatedData,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];
      const rules = validationRules[field.name] || {};

      // Required validation
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = field.label + " là bắt buộc";
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value) return;

      // Email validation
      if (field.type === "email" && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = "Email không hợp lệ";
      }

      // Phone validation
      if (field.type === "tel" && !/^[0-9+\-\s()]+$/.test(value)) {
        newErrors[field.name] = "Số điện thoại không hợp lệ";
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        newErrors[
          field.name
        ] = `${field.label} phải có ít nhất ${rules.minLength} ký tự`;
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[
          field.name
        ] = `${field.label} không được vượt quá ${rules.maxLength} ký tự`;
      }

      // Custom validation
      if (rules.validate && typeof rules.validate === "function") {
        const customError = rules.validate(value, formData);
        if (customError) {
          newErrors[field.name] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || "",
      onChange: handleChange,
      disabled: isLoading,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "select":
        return (
          <Select {...commonProps}>
            {field.placeholder && (
              <option value="" disabled>
                {field.placeholder}
              </option>
            )}
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      case "textarea":
        return <TextArea {...commonProps} rows={field.rows || 4} />;

      default:
        return <Input {...commonProps} type={field.type || "text"} />;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <FormGroup key={field.name}>
          <Label htmlFor={field.name}>
            {field.label} {field.required && "*"}
          </Label>
          {renderField(field)}
          {errors[field.name] && (
            <ErrorMessage>{errors[field.name]}</ErrorMessage>
          )}
        </FormGroup>
      ))}

      <ButtonGroup>
        <Button type="button" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : submitLabel}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default GenericForm;
