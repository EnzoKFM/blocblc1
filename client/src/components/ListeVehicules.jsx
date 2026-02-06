import { useEffect, useState } from "react";
import VehiculeModal from "./VehiculeModal";
const baseURI = import.meta.env.VITE_API_BASE_URL;

const ListeVehicules = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const fetchVehicles = () => {
    setLoading(true);
    fetch(baseURI + 'api/vehicules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleDelete = async (vehicle) => {
    if (!confirm(`Supprimer le véhicule ${vehicle.marque} ${vehicle.modele} ?`)) {
      return;
    }

    try {
      const response = await fetch(baseURI + `api/vehicules/delete/${vehicle.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Véhicule supprimé');
        fetchVehicles();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleCreate}>➕ Créer un véhicule</button>
      </div>

      <table className="listeVehiculesTable">
        <thead>
          <tr>
            <th>Plaque</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Aucun véhicule trouvé
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.marque}</td>
                <td>{vehicle.modele}</td>
                <td>{vehicle.annee}</td>
                <td>{vehicle.client_id ? vehicle.client_id : "—"}</td>
                <td>
                  <button onClick={() => handleEdit(vehicle)}>✏️</button>
                  <button onClick={() => handleDelete(vehicle)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <VehiculeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicleToEdit={selectedVehicle}
        onSuccess={fetchVehicles}
      />
    </div>
  );
};

export default ListeVehicules;