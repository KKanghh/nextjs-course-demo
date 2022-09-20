import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

function DetailPage(props) {
  const router = useRouter();

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content="Meetup Detail" />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://attsky1:rkdwldud12@cluster0.s7ukl21.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: true }).toArray();
  client.close();
  return {
    fallback: true,
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  const client = await MongoClient.connect(
    "mongodb+srv://attsky1:rkdwldud12@cluster0.s7ukl21.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  const meetupId = context.params.meetupId;
  console.log(meetupId);
  const meetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });
  console.log(meetup);
  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        title: meetup.title,
      },
    },
  };
}

export default DetailPage;
