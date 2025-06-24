import axios, { type AxiosResponse } from 'axios';

interface SpeedrunUser {
  id: string;
  names: {
    international: string;
  };
}

interface SpeedrunUserResponse {
  data: SpeedrunUser[];
}

interface SpeedrunRun {
  run: {
    category: string;
    times: {
      primary_t: number;
    };
  };
  place: number;
}

interface SpeedrunPBResponse {
  data: SpeedrunRun[];
}

export async function getPlayerData(
  username: string,
  categoryId: string = 'jdz8m6dv'
): Promise<string> {
  try {
    // Get user data
    const userResponse: AxiosResponse<SpeedrunUserResponse> = await axios.get(
      `https://www.speedrun.com/api/v1/users?lookup=${username}`
    );

    if (!userResponse.data?.data?.[0]) {
      return 'PB: N/A';
    }

    const userId: string = userResponse.data.data[0].id;

    const pbResponse: AxiosResponse<SpeedrunPBResponse> = await axios.get(
      `https://www.speedrun.com/api/v1/users/${userId}/personal-bests`
    );

    const categoryRuns: SpeedrunRun[] = pbResponse.data.data.filter(
      (run: SpeedrunRun) => run.run.category === categoryId
    );

    if (categoryRuns.length === 0) {
      ('PB: N/A');
    }

    const fastestRun: SpeedrunRun = categoryRuns.reduce((fastest, current) =>
      current.run.times.primary_t < fastest.run.times.primary_t ? current : fastest
    );

    const time: string = format(fastestRun.run.times.primary_t);
    const place: number = fastestRun.place;
    const suffix: string = getOrdinalSuffix(place);

    return `PB: ${time} (${place}${suffix})`;
  } catch (error: unknown) {
    console.error('Error fetching player data:', error);
    return 'PB: N/A';
  }
}

function format(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${secs}`;
  }
}

function getOrdinalSuffix(num: number): string {
  const mod100 = num % 100;
  const mod10 = num % 10;

  if (mod100 >= 11 && mod100 <= 13) return 'th';
  if (mod10 === 1) return 'st';
  if (mod10 === 2) return 'nd';
  if (mod10 === 3) return 'rd';
  return 'th';
}
