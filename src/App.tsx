import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState(
    [] as {
      name: string;
      platform: "Windows" | "Linux" | "macOS";
      downloadUrl: string;
      downloadCount: number;
    }[]
  );
  const [tag, setTag] = useState("");
  useEffect(() => {
    fetch(
      "https://api.github.com/repos/wongjiahau/ttap-desktop-client/releases"
    )
      .then((result) => result.json())
      .then((content) => {
        const latestRelease = content[0];
        setTag(latestRelease.tag_name);
        setItems(
          (latestRelease?.assets as any[]).map((x: any) => {
            return {
              name: x.name,
              platform: x.name.endsWith("exe")
                ? "Windows"
                : x.name.endsWith("dmg")
                ? "macOS"
                : "Linux",
              downloadCount: x.download_count,
              downloadUrl: x.browser_download_url,
            };
          })
        );
      })
      .catch((error) => alert(error));
  }, []);

  // For debug purpose
  console.log(items);

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
              {items
                .sort((a, b) => b.platform.localeCompare(a.platform))
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.platform}</td>
                    <td>{item.name}</td>
                    <td>
                      <button
                        style={{ width: 288, alignSelf: "center" }}
                        className="btn"
                        onClick={() => window.open(item.downloadUrl)}
                      >
                        Download
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
        </div>
      </div>
    </div>
  );
}

export default App;
