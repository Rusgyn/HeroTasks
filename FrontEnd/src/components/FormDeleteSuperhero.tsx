const FormDeleteSuperhero = () => {
  return (
    <div>
      <form>
        <label htmlFor="the_superheroes">Superhero: </label>
        <select name="the_superheroes" id="the_superheroes">
          <option value="test1">test1</option>
          <option value="test2">test2</option>
          <option value="test3">test3</option>
        </select>
        <input type="submit" value="Eliminate"></input>
      </form>
    </div>
  )
}

export default FormDeleteSuperhero;