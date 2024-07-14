import { Form } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

type AntdFormItemProps = React.ComponentProps<typeof Form.Item>;

export type FormItemProps<TFieldValues extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  onChange?: (value: any) => void;
  disabled?: boolean;
  defaultValue?: any;
} & Omit<AntdFormItemProps, 'name' | 'normalize' | 'rules' | 'validateStatus'>;

const FormItem = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  children,
  help,
  onChange,
  defaultValue,
  disabled,
  ...props
}: FormItemProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const handleCustomChange = (value: any) => {
          field.onChange(value);
          onChange?.(value);
        };

        const childrenWithProps = React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Assert the type for the child element
            const childElement = child as React.ReactElement<
              React.HTMLProps<HTMLInputElement>
            >;
            return React.cloneElement(childElement, {
              ...field,
              onChange: handleCustomChange,
              disabled: disabled,
            });
          }
          return child;
        });
        const handleNormalize: AntdFormItemProps['normalize'] = (value) => {
          field.onChange(value);
          return value;
        };

        return (
          <Form.Item
            className="text-sm text-black"
            {...props}
            initialValue={field.value}
            normalize={handleNormalize}
            validateStatus={fieldState.invalid ? 'error' : undefined}
            help={fieldState.error?.message ?? help}
          >
            {childrenWithProps}
          </Form.Item>
        );
      }}
    />
  );
};
export default FormItem;
