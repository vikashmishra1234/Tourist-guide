// priestValidation.js
const { z } = require('zod');

const priestValidationSchema = z.object({
  Name: z.string().min(1, "Name is required."),
  Password: z.string().min(1, "Password is required."),
  Phone: z.string(),
 Whatsapp:z.string(),
  Invites: z.string().optional(),
  Bio: z.string().min(1, "Bio is required."),
  Profile: z.string().optional(),
});

const validatePriest=async(req,res,next)=>{
        try {
            const validate = priestValidationSchema.safeParse(req.body);
            if(validate.success){
                next();
            }
            else{
                res.status(404).json({
                    error:validate.error,
                    success:false
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success:false,
                error:"validation failed"
            })
        }
}

module.exports = validatePriest;
