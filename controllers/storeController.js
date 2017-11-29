const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res)=>{
    console.log(req.name)
    res.render('index')
};

exports.addStore = (req, res)=>{
    res.render('editStore', {title: 'Add Store'});
};



exports.createStore = async(req, res)=>{
    const store = await(new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`); //back to home page
};

exports.getStores = async(req, res) => {
    //1. Query the database for a list of all stores
    const stores = await(Store.find());
    console.log(stores);
    res.render('stores', {title:'Stores', stores:stores});
};

exports.editStore = async(req, res) =>{
    //find store given id - use await otherwise its a promise of returning data
    const store = await Store.findOne({_id:req.params.id});
    //confirm they are store owner
    // render edit form so the user
    res.render('editStore', {title:`Edit ${store.name}`, store} );

};

exports.updateStore = async(req, res)=>{
    //find and update the store
    const store = await Store.findOneAndUpdate({_id:req.params.id}, req.body,{new:true,runValidators:true}).exec();  //runs the query

    //redirect them to the store and tell them it worked
    req.flash('success', `Successfully Updated <strong>${store.name}<strong>. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
};