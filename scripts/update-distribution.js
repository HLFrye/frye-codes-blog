const AWS = require("aws-sdk");
const cloudFront = new AWS.CloudFront();

async function updateDistribution({cloudFrontId, path}) {  
  const distribution = await cloudFront.getDistributionConfig({Id: cloudFrontId}).promise();
  const etag = distribution.ETag;
  delete distribution.ETag;
  distribution.DistributionConfig.Origins.Items[0].OriginPath = "/" + path;
  distribution.IfMatch = etag;
  distribution.Id = cloudFrontId;
  const updateResult = await cloudFront.updateDistribution(distribution).promise();

  console.dir(updateResult);
}

if (require.main === module) {
  const ArgumentParser = require("argparse").ArgumentParser;
  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'Tool to update npm distribution'
  });
  parser.addArgument(
    [ '-id', '--cloudFrontId' ],
    {
      help: 'ID of the CloudFront distribution update'
    }
  );
  parser.addArgument(
    [ '-p', '--path' ],
    {
      help: 'New origin path to set'
    }
  );
  var args = parser.parseArgs();
  updateDistribution(args).then(() => console.log("Complete"));
}