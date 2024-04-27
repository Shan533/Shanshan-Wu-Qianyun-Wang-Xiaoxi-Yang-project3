import React from "react";
import { Modal, Form, Input, Checkbox } from "antd";

function PasswordForm({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { website, password, num, alphabet, marks, length } = values;
      let generatedPassword = password;

      if (!password && (num || alphabet || marks)) {
        const payload = {
          url: website,
          alphabet: alphabet,
          numerals: num,
          symbols: marks,
          length: length || 8,
        };
        onSubmit(payload);
      } else {
        onSubmit({ url: website, password: generatedPassword });
      }
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
        <Form.Item name="password" label="Password">
          <Input.Password />
        </Form.Item>
        <Form.Item name="num" valuePropName="checked">
          <Checkbox>Numbers</Checkbox>
        </Form.Item>
        <Form.Item name="alphabet" valuePropName="checked">
          <Checkbox>Alphabet</Checkbox>
        </Form.Item>
        <Form.Item name="marks" valuePropName="checked">
          <Checkbox>Symbols</Checkbox>
        </Form.Item>
        <Form.Item name="length" label="Length">
          <Input type="number" min={4} max={50} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PasswordForm;
