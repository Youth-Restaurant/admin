import LocationForm from '@/components/location/LocationForm';
import CreateSubLocation from '@/components/location/CreateSubLocation';

export default async function Home() {
  return (
    <div className='container mx-auto px-4'>
      <LocationForm />
      <CreateSubLocation />
    </div>
  );
}
