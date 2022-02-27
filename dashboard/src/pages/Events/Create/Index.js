import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppState } from "../../../contexts/AppContext";

import Info from "./Info";
import Settings from "./Settings";
import Form from "./Form";
// import Stye from "./Style";

const Index = () => {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [curStep, setCurStep] = useState(1);
  const [data, setData] = useState({
    info: {
      name: '',
      organizer: '',
      address: '',
      tags: ['ingen', 'one', 'two'], // ! get from DB, and create method to add new once
      time: {
        start: '',
        end: '',
      },
      date: '',
      description: '',
    },
    settings: {
      date: {
        open: '',
        close: '',
      },
      time: {
        open: '',
        close: '',
      },
      maxParticipants: null,
      isWaitingList: false,
      isReminder: true,
      isSignoff: true,
      isSignoffReminder: false,
      signoffReminder: {
        date: '',
        time: '',
      },
      isConfirmationMail: true,
      isMailTicked: true,
      mailMessage: 'Hei %bruker%.\nDu er påmeldt %event%.\n\nSe info om arrangement her: %link%.',
    },
    forms: {

    },
    style: {

    },
  });

  const prevStep = () => {
    setCurStep(curStep => curStep - 1);
  };

  const nextStep = () => {
    setCurStep(curStep => curStep + 1);
  };

  const updateData = (type, newData) => {
    setData(data => {
      return { ...data, [type]: newData };
    });
  };

  const submitForm = () => {
    console.log('sending form data');
    // ! validate formData
    navigate('/events');
  };

  useEffect(() => {
    if (state.organizations.length === 0) {
      navigate('/organizations/create');
    }
  });

  switch (curStep) {
    case 1:
      return (
        <Info
          nextStep={nextStep}
          updateData={updateData}
          data={data.info}
        />
      );
    case 2:
      return (
        <Settings
          prevStep={prevStep}
          nextStep={nextStep}
          updateData={updateData}
          data={data.settings}
        />
      );
    case 3:
      return (
        <Form
          prevStep={prevStep}
          submit={submitForm}
          updateData={updateData}
          data={data.forms}
        />
      );
    default:
    // do nothing
  }
};

export default Index;
