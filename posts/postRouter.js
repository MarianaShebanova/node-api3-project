const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

////////////////////////////////////////////

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'The posts information could not be retrieved.',
      });
    });
});
////////////////////////////////////////////

router.get('/:id', validatePostId, (req, res) => {
  const { id } = req.params;
  Posts.getById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The post information could not be retrieved."
      });
    })
});

////////////////////////////////////////////

router.delete('/:id', validatePostId,  (req, res) => {
  const id = req.params.id;

  Posts.remove(id)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The post could not be removed"
      });
    });
});
////////////////////////////////////////////

router.put('/:id', validatePostId,  (req, res) => {
  const changes = req.body;
  Posts.update(req.params.id, changes)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'The post information could not be modified.',
      });
    });
});
////////////////////////////////////////////

router.post('/', validateUserID, validatePostText, (req, res) => {
  const changes = req.body;

  Posts.insert(changes)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'sorry, we ran into an error creating the post',
      });
    });
});

////////////////////////////////////////////

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
    .then(data => {
      if (!data) {
        return res.status(400).json({
          errorMessage: "invalid post id"
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "The post information could not be retrieved."
      });
    })
  next();
}

function validatePostText(req, res, next) {
  const changes = req.body;
  if (!changes || !changes.text) {
    return res.status(400).json({ errorMessage: 'missing required text field' });
  }
  next();
}
function validateUserID(req, res, next) {
  const changes = req.body;
  if (!changes || !changes.user_id) {
    return res.status(400).json({ errorMessage: 'missing required user_id field' });
  }
  next();
}

module.exports = router;