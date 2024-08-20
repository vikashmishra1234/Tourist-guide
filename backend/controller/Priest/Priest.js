const Priest = require('../../models/Priest/Registration')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Feedback = require('../../models/Priest/Feedback');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

// JWT secret key
const JWT_SECRET = 'vikash mishra'; // Replace with your actual secret key

exports.priestRegistration = async (req, res) => {
    try {
      
        const { Phone, Password } = req.body;

        // Check if the user already exists
        const existingUser = await Priest.findOne({ Phone });
        if (existingUser) {
            return res.status(400).json({ error: `User already exists with this phone number: ${Phone}` });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Create a new user object
        const newUser = new Priest({ ...req.body, Password: hashedPassword });

        // Save the new user
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);

        // Respond with success message and token
        res.status(201).json({
            newUser,
           success: true,
            message: 'Registration successful',
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getPriest=async(req,res)=>{
    try {
        if(myCache.get("priest")){
            const priest = myCache.get("priest");
            return res.status(201).json({priest:priest,success:true});
        }
        const priest =await Priest.findById(req.user.id);
        if(!priest){
            return res.status(404).json({success:false,error:'User Not Found'});
        }
        myCache.set("priest",priest);
        res.status(201).json({priest:priest,success:true});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:'Server Error',success:false});
    }
}

exports.updatePriest = async (req, res) => {
    try {
       // Assuming priest_id is passed as a URL parameter

        // Find the priest by ID and update with the data from req.body
        
        if(req.body.Password){

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.Password, salt);
            req.body.Password = hashedPassword;
        }
        const updatePriest = await Priest.findByIdAndUpdate(req.user.id, req.body);

        if (!updatePriest) {
            return res.status(404).json({ error: 'Priest not found', success: false });
        }
        myCache.del("priests")
        res.status(201).json({
            message: 'Profile Update Successful',
            updatePriest,
            success: true
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error', success: false });
    }
};




exports.priestLogin = async (req, res) => {
    try {
        const { Phone, Password } = req.body;

        // Check if the user exists
        const user = await Priest.findOne({ Phone });
        if (!user) {
            return res.status(400).json({ error: `No user found with this phone number: ${Phone}` });
        }

        // Check if the password matches
    if(Password) {   const isMatch =  bcrypt.compareSync(Password,user.Password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }}

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET);

        // Respond with success message and token
        res.status(200).json({
            user,
            success: true,
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({success:false, error: 'Server error' });
    }
};

exports.deletePriest = async (req, res) => {
    try {
      const { id } = req.user; // Destructure id from req.user
      const deleted = await Priest.findByIdAndDelete(id);
  
      // Check if a document was actually deleted
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      myCache.del("priests")
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  exports.addFeedback = async(req,res)=>{
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save()
        res.status(201).json({success:true,message:'Feedback Added Successfully'});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error:'Server Error'})
    }
  }
  exports.getFeedbacks = async(req,res)=>{
   

    try {
        const feedbacks = await Feedback.find({priestId:req.query.priestId});
        if(feedbacks.length===0){
            return res.status(404).json({error:'Feed backs Not Found '})
        }
        res.status(201).json({success:true,feedbacks});
    } catch (error) {
        res.status(500).json({error:'Server Error'})
    }
  }
  exports.getPriests = async(req,res)=>{
    try {
        if(myCache.get("priests")){
            const priests = myCache.get("priests")
            return res.status(201).json({success:true,priests});

        }
        const priests = await Priest.find({});
        if(priests.length===0){
            return res.status(404).json({error:'No Priest Found'});
        }
        myCache.set("priests",priests);
        res.status(201).json({success:true,priests});
    } catch (error) {
        res.status(500).json({error:'Server Error'})
    }
  }

  exports.phoneExits=async(req,res)=>{
    try {
        const Phone = req.query.Phone
        const phone = await Priest.findOne({Phone});
        
        if(!phone){
            return res.status(404).json({success:false,error:"User With Phone Number Does Not Exits"});
        }
        res.status(201).json({success:true});
    } catch (error) {
        res.status(500).json({error:"Server Error",success:false});
    }
  }
