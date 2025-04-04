const Filter = ({ searchTerm, onSearchChange }) => {
    return (
      <div>
        <input
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search by name"
        />
      </div>
    );
  };
  export default Filter;