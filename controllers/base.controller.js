function BaseController() {
  if (arguments.length > 0) this.options = arguments[0];
  this.model = this.options.model;
}

BaseController.prototype.list = function(req, res) {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 0;
  if (req.params.id) {
    this.model.findById(req.params.id, function(err, model) {
      if (err) return res.status(500).send(err);
      res.send(model);
    }); 
  } else {
    this.model.find({}, function(err, model) {
      if (err) return res.status(500).send(err);
      res.json(model);
    })
    .skip(size * (page - 1)) 
    .limit(size)
    //.sort('-date');
  }
};

BaseController.prototype.add = function(req, res) {
  const newModel = new this.model(req.body);
  const that = this;
  newModel.save(function(err, model) {
    if (err) return res.status(500).send(err);
    res.json(model);
  });
};

BaseController.prototype.update = function(req, res) {
  const that = this;
  this.model.updateOne({
      _id: req.params.id
    },
    req.body,
    function(err, model) {
      if (err) return res.status(500).send(err);
      res.json(req.body);
    });
};

BaseController.prototype.delete = function(req, res) {
  const that = this;
  this.model.findOne({
      _id: req.params.id
    },
    function(err, model) {
      if (err) return res.status(500).send(err);
      if (model){
        model.remove();
        res.json(model);
      } else {
        res.json({error:'id not found'});
      }
    });
};

module.exports = BaseController;