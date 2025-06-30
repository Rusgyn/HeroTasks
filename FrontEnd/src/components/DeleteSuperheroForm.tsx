import { useEffect, useState } from "react";
import axios from "axios";
import { Superhero } from '../types/Superhero';
import '../styles/DeleteSuperheroForm.scss';
const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

interface Props {
  onSubmit: (heroId: number) => Promise<void>;
  errorMessage: string;
  refresh: any;
}

const DeleteSuperheroForm: React.FC<Props> = ({ onSubmit, errorMessage, refresh }) => {
  const [heroes, setHeroes] = useState<Superhero[]>([]);
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await axios.get(`${backendUrl}/HeroTasks/superheroes-with-tasks`, {
          withCredentials: true,
        });
        setHeroes(response.data);
      } catch (error) {
        console.error("DeleteSuperheroForm. Failed to fetch heroes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, [refresh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHeroId !== null) {
      await onSubmit(selectedHeroId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="superhero-select">Choose a Superhero to Remove from the Mission:</label>
      <br />

      <div className="del_superhero__select">

        {loading ? (
          <p>Loading superheroes...</p>
        ) : (
          <select
            id="superhero-select"
            value={selectedHeroId ?? ''}
            onChange={(event) => setSelectedHeroId(Number(event.target.value))}
          >
            <option value="" disabled>Select a superhero</option>
            {heroes.map((hero) => (
              <option key={hero.id} value={hero.id}>
                {hero.superhero_name}
              </option>
            ))}
          </select>
        )}
        <button className="del_superhero__select_btn" type="submit" disabled={selectedHeroId === null}>
          Eliminate
        </button>

      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
  
};

export default DeleteSuperheroForm;