import { useEffect, useState } from "react";
import "./App.css";
import { firestore } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // function to fetch all recipes from firebase
  const fetchRecipes = async () => {
    try {
      const recipesRef = collection(firestore, "recipe-description");
      const querySnapshot = await getDocs(recipesRef);

      const fetchedRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.log("error in fetching recipes", error);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="App">
      <h1>Recipe App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={fetchRecipes}>Search</button>
      </div>
      <div className="recipe-container">
        <table style={{ padding: "10px" }}>
          <thead>
            <tr style={{ margin: "10px" }}>
              <th style={{ padding: "10px" }}>#</th>
              <th style={{ padding: "10px" }}>Name</th>
              <th style={{ padding: "10px" }}>Image</th>
              <th style={{ padding: "10px" }}>Instruction</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, index) => (
                <tr key={recipe.id}>
                  <td>{index + 1}</td>
                  <td>{recipe.name}</td>
                  <td>
                    <img
                      src={recipe.image || "no-recipe"}
                      alt={recipe.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>
                    <ul style={{ paddingLeft: "40px" }}>
                      {Array.isArray(recipe.instruction) ? (
                        recipe.instruction.map((instr, idx) => (
                          <li key={idx}>{instr}</li>
                        ))
                      ) : (
                        <li>
                          {recipe.instruction || "No instructions available"}
                        </li>
                      )}
                    </ul>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ color: "red" }}>
                  No recipes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
