import { TextField, Button } from "@material-ui/core";

import News from "../News";

const Updates = () => (
  <div>
    <p className="title">Add News</p>
    <form
      autoComplete="off"
      className="employees-container"
      className="add-news-container"
    >
      {" "}
      <TextField size="small" name="title" label="Title" variant="outlined" />
      <TextField
        size="small"
        name="description"
        label="Description"
        variant="outlined"
      />
      <Button color="primary" variant="contained">
        UPLOAD
      </Button>
    </form>
    <News />
  </div>
);

export default Updates;
