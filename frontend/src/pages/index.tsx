import { GetServerSideProps } from 'next';
import Link from 'next/link';
import api from '../utils/api';
//import '../styles/countries.css';

interface Country {
  countryCode: string;
  name: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get<Country[]>('/countries');
    return { props: { countries: response.data } };
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    return { props: { countries: [] } };
  }
};

const Home = ({ countries }: { countries: Country[] }) => {
  return (
    <div className="countries-container">
      <h1 className="countries-title">Available Countries</h1>
      <ul className="countries-list">
        {countries.map((country) => (
          <li key={country.countryCode} className="country-item">
            <Link href={`/country/${country.countryCode}`}>{country.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
