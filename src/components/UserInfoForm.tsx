import Input from './Common/Input';
import Modal from './Buttons/Modal';

interface userInfoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserInfonForm({ isOpen, onClose }: userInfoFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} nameButon="Enregistrer">
      <p>Prénom</p>
      <Input
        type="text"
        onChange={() => {}}
        className=""
        placeholder=""
        value=""
      />
      <p>Date de naissance</p>
      <input type="date" />
      <p>Langues</p>
      <select>
        <option value="Français">Français</option>
        <option value="Anglais">Anglais</option>
      </select>
      <p>Thème</p>
      <input type="radio" name="thème" />
    </Modal>
  );
}

export default UserInfonForm;
