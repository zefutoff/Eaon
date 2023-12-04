import React, { useState } from 'react';
import Modal from './Buttons/Modal';

interface FormValues {
  firstname: string;
  birthDate: string;
  language: string;
  theme: string;
}

interface UserInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultFormValues: FormValues = {
  firstname: '',
  birthDate: '',
  language: 'Francais',
  theme: 'false',
};

function UserInfoForm({ isOpen, onClose }: UserInfoFormProps) {
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.electron.ipcRenderer.sendMessage('save-user-info', formValues);
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <form onSubmit={handleSubmit}>
        <p>Prénom</p>
        <input
          type="text"
          name="firstname"
          value={formValues.firstname}
          onChange={handleInputChange}
          required
        />
        <p>Date de naissance</p>
        <input
          type="date"
          name="birthDate"
          value={formValues.birthDate}
          onChange={handleInputChange}
          required
        />
        <p>Langues</p>
        <select
          name="language"
          value={formValues.language}
          onChange={handleInputChange}
          required
        >
          <option value="French">Français</option>
          <option value="English">Anglais</option>
        </select>
        <p>Thème</p>
        <input
          type="radio"
          name="theme"
          value={formValues.theme}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Enregistrer</button>
      </form>
    </Modal>
  );
}

export default UserInfoForm;
