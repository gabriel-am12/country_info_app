import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Link from 'next/link';

interface CountryInfo {
  country: string;
  flag: string;
  borders: { countryCode: string; commonName: string }[];
  population: { year: number; value: number }[];
}

const CountryDetails = () => {
  const router = useRouter();
  const { code } = router.query;
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);

  useEffect(() => {
    if (code) {
      api
        .get<CountryInfo>(`/country/${code}`)
        .then((response) => setCountryInfo(response.data))
        .catch((error) =>
          console.error('Error fetching country info:', error.message),
        );
    }
  }, [code]);

  if (!countryInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">{countryInfo.country}</h1>
      <img
        src={countryInfo.flag}
        alt={`${countryInfo.country} flag`}
        className="w-40 my-4"
      />

      <h2 className="text-xl font-semibold mb-2">Border Countries</h2>
      <ul className="list-disc pl-5">
        {countryInfo.borders.map((border) => (
          <li key={border.countryCode}>
            <Link href={`/country/${border.countryCode}`}>
              {border.commonName}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Population Over Time</h2>
      <LineChart
        width={600}
        height={300}
        data={countryInfo.population}
        className="my-4"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default CountryDetails;
