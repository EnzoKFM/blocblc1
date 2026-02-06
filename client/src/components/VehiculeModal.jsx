import { useEffect, useState } from 'react';
import Modal from './Modal';
const baseURI = import.meta.env.VITE_API_BASE_URL;

const VehiculeModal = ({ isOpen, onClose, vehicleToEdit = null, onSuccess }) => {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        marque: '',
        modele: '',
        annee: '',
        client_id: null
    });

    const isEditMode = vehicleToEdit !== null;

    useEffect(() => {
        if (vehicleToEdit) {
            setFormData({
                id: vehicleToEdit.id,
                marque: vehicleToEdit.marque,
                modele: vehicleToEdit.modele,
                annee: vehicleToEdit.annee,
                client_id: vehicleToEdit.client_id
            });
        } else {
            // Réinitialise le formulaire pour la création
            setFormData({
                id: '',
                marque: '',
                modele: '',
                annee: '',
                client_id: null
            });
        }
    }, [vehicleToEdit, isOpen]);

    useEffect(() => {
        fetch(baseURI + "api/clients", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(() => alert("Erreur chargement clients"));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id' && value.length > 11) {
            return;
        }
        if (name === 'annee' && value.length > 4) {
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        }
    )};

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditMode 
                ? `${baseURI}api/vehicules/update/${vehicleToEdit.id}`
                : `${baseURI}api/vehicules/create`;
            
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEditMode ? 'Véhicule modifié' : 'Véhicule créé');
                onClose();
                if (onSuccess) onSuccess(); // Rafraîchir la liste
            } else {
                alert(`Erreur lors de la ${isEditMode ? 'modification' : 'création'} du véhicule`);
            }
            
        } catch (error) {
            alert('Erreur réseau');
        }
    };

    return (
    <div>
        <Modal 
         isOpen={isOpen}
         onClose={onClose}
        >
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Modification' : 'Création'} d'un véhicule</h2>
                <input type="number" name="id" placeholder="Plaque d'immatriculation" value={formData.id} onChange={handleChange} disabled={isEditMode} required/>
                <input type="text" name="marque" placeholder="Marque" value={formData.marque} onChange={handleChange} required />
                <input type="text" name="modele" placeholder="Modèle" value={formData.modele} onChange={handleChange} required />
                <input type="number" name="annee" placeholder="Année" value={formData.annee} onChange={handleChange} required  />
                <select
                    name="client_id"
                    value={formData.client_id || ""}
                    onChange={handleChange}
                >
                    <option value="">Aucun client</option>

                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                        {client.lastname} {client.firstname}
                        </option>
                    ))}
                </select>
                <button type="submit">{isEditMode ? 'Modifier' : 'Créer'}</button>
            </form>
         </Modal>
    </div>
    );
}

export default VehiculeModal