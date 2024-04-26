// components/PasswordForm.js
import React from "react";
import { Modal, Form, Input, Checkbox } from "antd";
import { generate } from "generate-password";

function PasswordForm({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { website, password, num, alphabet, marks } = values;
      let generatedPassword = password;

      if (num || alphabet || marks) {
        generatedPassword = generate({
          numbers: num,
          uppercase: alphabet,
          lowercase: alphabet,
          symbols: marks,
        });
      }

      onSubmit({ website, password: generatedPassword });
      form.resetFields();
      onCancel();
    });
  };

  return (
    <Modal
      title="Add Password"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: true, message: "Please enter a website" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="num" valuePropName="checked">
          <Checkbox>Numbers</Checkbox>
        </Form.Item>
        <Form.Item name="alphabet" valuePropName="checked">
          <Checkbox>Alphabet</Checkbox>
        </Form.Item>
        <Form.Item name="marks" valuePropName="checked">
          <Checkbox>Marks</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PasswordForm;
