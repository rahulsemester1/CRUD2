const joi=require("joi");

module.exports.listSchema=joi.object({
    list:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(100) ,
        location:joi.string().required(),
        country:joi.string().required(),
        image:joi.string().allow("",null),
    }).required()
});