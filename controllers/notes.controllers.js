exports.getNotes = (req, res) => {
    const tagsQuery = "SELECT * FROM notes";
    db.query(tagsQuery, (err, data) => {
      if (err) { return res.status(500).send(err); }
      return res.json(data);
    });
}