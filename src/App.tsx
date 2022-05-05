import { useState, useEffect } from "react";
import "./App.css";

type Release = {
  tag_name: string;
  published_at: string;
  assets: ReleaseAsset[];
};

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  download_count: number;
};

function App() {
  const [releases, setReleases] = useState([] as Release[]);
  useEffect(() => {
    fetch(
      "https://api.github.com/repos/wongjiahau/ttap-desktop-client/releases"
    )
      .then((result) => result.json())
      .then(setReleases)
      .catch((error) => alert(error));
  }, []);

  const sortedReleases = releases.sort((a, b) =>
    a.published_at.localeCompare(b.published_at)
  );

  // For debug purposes
  console.log({ sortedReleases });

  const latestRelease = sortedReleases[sortedReleases.length - 1];

  const firstRelease = sortedReleases[0];
  const assets = latestRelease?.assets ?? [];

  const tag = latestRelease?.tag_name;

  const totalDownloadCount = releases.reduce(
    (sum, release) =>
      sum +
      release.assets.reduce((sum, asset) => sum + asset.download_count, sum),
    0
  );

  return (
    <div style={{ width: 650 }} className="p-centered">
      <div className="wrapper card">
        <div className="card-header">
          <div className="card-title h1">Tired of arranging timetable?</div>
          <div className="card-title h1">Try T.T.A.P.</div>
          <div className="card-subtitle text-gray">
            The Time Table Arranging Program exclusively for UTAR students.
          </div>
        </div>
        <div className="card-image">
          <img src="https://github.com/wongjiahau/ttap-web/blob/master/public/big_calendar.png?raw=true" />
        </div>
        <div className="card-body">Download TTAP Desktop Client ({tag})</div>
        <div className="card-footer">
          <table className="table" style={{ textAlign: "center" }}>
            <tbody>
              {assets
                .map((asset) => ({
                  ...asset,
                  platform: asset.name.endsWith("exe")
                    ? "Windows"
                    : asset.name.endsWith("dmg")
                    ? "macOS"
                    : "Linux",
                }))
                .sort((a, b) => b.platform.localeCompare(a.platform))
                .map((asset, index) => (
                  <tr key={index}>
                    <td>{asset.platform}</td>
                    <td>{asset.name}</td>
                    <td>
                      <button
                        style={{ width: 288, alignSelf: "center" }}
                        className="btn"
                        onClick={() => window.open(asset.browser_download_url)}
                      >
                        Download ({asset.download_count})
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
          <button
            className="btn btn-link"
            onClick={() =>
              window.open(
                "https://github.com/wongjiahau/ttap-desktop-client/releases/"
              )
            }
          >
            All Releases
          </button>
          <div>
            Total downloads since{" "}
            {new Date(firstRelease?.published_at ?? 0).toLocaleDateString()}{" "}
            (all versions, all platforms): {totalDownloadCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
