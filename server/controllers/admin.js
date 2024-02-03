const itemsModel = require("../models/shopItem");

// Delete one or more from an items shop

const removeOneItem = async (req, res) => {
     try {
      const deleteItem = await itemsModel.findByIdAndDelete(req.params.id);

      if (!deleteItem) {
        res.status(422).json({ message: "Not found"});
      } else {
        res.json(deleteItem);
        res.end();
      };
     } catch (error) {
        res.status(500).json(error.message);
     };

};

const removeManyItems = async (req, res) => {
     try { 
      // Example: { ids: ['id1', 'id2', 'id3'] }
      const { ids } = req.body;
      const deleteItems = await itemsModel.deleteMany({_id: {$in: ids}});
      
      if(deleteItems.deletedCount > 0) {

      res.json({ message: `${deleteItems.deletedCount} documents deleted` });

      } else {
        res.status(422).json({ message: "Not found"});
      };

     } catch (error) {
      res.status(500).json(error.message);
     };
};


// Search shop items based on different properties

const searchItem = async (req, res) => {
     try {
        const foundItems = await itemsModel.find(req.query);
        
        if (foundItems){
        res.json(foundItems);
        } else {
          res.status(422).json({message: 'Not found'});
        };

     } catch (error) {
      res.status(500).json(error.message);
     };
 };

 const getData = async (_, res) => {
  try {
    const posts = await itemsModel.find({});
    res.status(200).json(posts);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
 }

 module.exports = {removeOneItem,
                   removeManyItems,
                   searchItem,
                   getData};

