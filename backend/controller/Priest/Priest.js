const Priest = require('../../models/Priest/Registration')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Feedback = require('../../models/Priest/Feedback');
const NodeCache = require( "node-cache" );
const redis = require('../../redisConfig.js')

// JWT secret key

const JWT_SECRET = process.env.JWT_SECRET; // Replace with your actual secret key


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
        const cachedPriests = await redis.get('priests');
        if (cachedPriests) {
            const priests = JSON.parse(cachedPriests);
            priests.push(newUser); // Append the newly registered priest
            await redis.set('priests', JSON.stringify(priests)); // Update the cache
        }
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
exports.getPriest = async (req, res) => {
    try {
        // Use the priest's ID to create a unique cache key
        const cacheKey = `priest:${req.user.id}`;
        const cachedPriest = await redis.get(cacheKey);

        if (cachedPriest) {
            // Return the cached data if available
            return res.status(200).json({ priest: JSON.parse(cachedPriest), success: true });
        }

        // Fetch the priest data from the database
        const priest = await Priest.findById(req.user.id);
        
        if (!priest) {
            return res.status(404).json({ success: false, error: 'User Not Found' });
        }

        // Cache the retrieved data with the unique key
        await redis.set(cacheKey, JSON.stringify(priest));

        // Return the retrieved data
        res.status(200).json({ priest, success: true });
    } catch (error) {
        // Log the error and respond with a server error message
        console.error('Error in getPriest:', error.message);
        res.status(500).json({ error: 'Server Error', success: false });
    }
};


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
        await redis.del("priests")
         await redis.del(`priest:${req.user.id}`)
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
      await redis.del("priests")
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
  exports.getPriests = async (req, res) => {
    try {
      
        const cachedPriests = await redis.get('priests');
        
        if (cachedPriests) {
          
            return res.status(200).json({ success: true, priests: JSON.parse(cachedPriests) });
        }

        
        const priests = await Priest.find({});
        
        if (priests.length === 0) {
            return res.status(404).json({ success: false, error: 'No Priest Found' });
        }

       
        await redis.set('priests', JSON.stringify(priests));

        
        res.status(200).json({ success: true, priests });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

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

  exports.increaseInvites = async(req,res)=>{
   try {
     const {priestId} = req.query;
     if(!priestId){
         return res.status(404).json({
             success:false,
             error:'please send the priest id'
         })
     }
 
    await Priest.findByIdAndUpdate(priestId, { $inc: { Invites: 1 } });
    await redis.del("priests")
    res.status(200).json({
        success:true,
        message:"invites updates successfully"
    })
   } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:false,
            error:"something went wrong"
        })
   }

  }
