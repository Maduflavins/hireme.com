module.exports = {

  database: process.env.DATABASE || 'mongodb://hireadev:imaginedragons@ds141796.mlab.com:41796/hireadev',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'superdragons',

}
