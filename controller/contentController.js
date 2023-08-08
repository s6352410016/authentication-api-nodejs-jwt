const content = (req , res) => {
    res.status(200).json({msg: `Your ${req.fullname} Authentication successfully`});
}

module.exports = {
    content
};