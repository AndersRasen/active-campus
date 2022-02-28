import Input from "../../../components/Actions/Input";
import Button from "../../../components/Actions/Button";
import Checkbox from "../../../components/Actions/Checkbox";
import { useEffect, useState } from "react";
import { useAppState } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { apiGetOrganizations } from '../../../helpers/brreg';
import { setOrganization } from "../../../helpers/firestore";

const OrganizationForm = ({ submitName, secondaryName, onSecondary, autofill }) => {
  const navigate = useNavigate();
  const { state, setState } = useAppState();
  const [optionalOrganizations, setOptionalOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    name: '',
    short_name: '',
    org_number: '',
    contactEmail: '',
    contactName: '',
    contactTlf: '',
  });

  // ! autofill will will out all fields with the current organization data

  useEffect(() => {
    if (data.name === '' || !data.org_number) {
      const timer = setTimeout(async () => {
        const res = await apiGetOrganizations(data.name);
        setOptionalOrganizations(res);
        updateData('org_number', '');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [data.name]);

  const updateData = (type, newData) => {
    if (type === 'name' && data.org_number !== '') {
      updateData('org_number', '');
    }
    setData(data => {
      return { ...data, [type]: newData };
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (data.org_number === '') {
      return setError('Må velge en organisasjon.');
    }

    try {
      setError('');
      setOrganization(state.user.id, data.name, data.short_name, data.org_number, data.contactEmail, data.contactName, data.contactTlf);
      setState('currentOrganization', data.name);
      navigate('/organizations');
    }
    catch (error) {
      console.error(error);
      setError('Organisasjon finnes alt.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-10 mb-10">
        <div className='flex flex-col gap-5'>
          <div className="flex flex-wrap gap-5">
            <Input required disable={autofill} onChange={(e) => updateData('name', e.target.value)} value={data.name} placeholder='Organisasjon navn' />
            <div className="bg-background border border-border rounded-md px-4 py-2 w-full sm:w-40 text-center">{data.org_number}</div>
          </div>

          {optionalOrganizations.length !== 0 &&
            <div className='select-none flex flex-col gap-1'>
              {optionalOrganizations.map(org => (
                <div key={org.organisasjonsnummer}
                  className='bg-light flex gap-5 justify-between border border-border rounded-md px-4 py-2 hover:cursor-pointer hover:bg-border'
                  onClick={() => {
                    updateData('name', org.navn);
                    updateData('org_number', org.organisasjonsnummer);
                    setOptionalOrganizations([]);
                  }}
                >
                  <p>{org.navn}</p>
                  <p>{org.organisasjonsnummer}</p>
                </div>
              ))}
            </div>
          }

          <Input required onChange={(e) => updateData('short_name', e.target.value)} defaultValue={state.currentOrganization?.short_name} placeholder='Visningsnavn' />
          <Checkbox required name='confirmation' label='Jeg bekrefter at jeg har rett til å ta besluttniger for denne organisasjonen.' />
        </div>

        <div className="flex flex-col gap-5">
          <Input required onChange={(e) => updateData('contactName', e.target.value)} defaultValue={state.currentOrganization.contact?.name} name='name' placeholder='Fult navn' />
          <Input required onChange={(e) => updateData('contactEmail', e.target.value)} defaultValue={state.currentOrganization.contact?.email} name='email' type="email" placeholder='Min@epost.no' />
          <Input required onChange={(e) => updateData('contactTlf', e.target.value)} defaultValue={state.currentOrganization.contact?.tlf} name='phone' placeholder='Telefon nummer' />
        </div>
      </div>

      {error && <p className="mb-5 text-danger">{error}</p>}

      <div className="flex gap-5 flex-wrap sm:flex-nowrap sm:w-80">
        <Button>{submitName}</Button>
        <Button onClick={onSecondary} style='danger'>{secondaryName}</Button>
      </div>
    </form>
  );
};

export default OrganizationForm;