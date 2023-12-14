"use strict";
const sp = () => {
    // -34.384840, -58.567240
    const val = document.cm.latlon.value;
    let v = val.split(", ");
    document.cm.lat.value = v[0];
    document.cm.lon.value = v[1];
};
const getJSON = () => ({
    "name": document.cm.name.value,
    "address": document.cm.address.value,
    "region": document.querySelector('#region').value,
    "notes": document.cm.notes.value,
    "status": parseInt(document.cm.status.value),
    "latitude": document.cm.lat.value,
    "longitude": document.cm.lon.value,
});

const fillRegion = async () => {
    document.cm.latlon.addEventListener("change", () => sp());
    document.querySelector("#env").addEventListener('click', async (e) => {
        await submit();
    });
  const genOpt = (text, value) => {
      let o = document.createElement("option");
      o.innerText = text;
      o.value = value;
      return o;
  };
    document.querySelector('#region').innerHTML = '';
  const f = await fetch(
      "https://colectiva.com.ar:5050/waterBodies/",
      { method: "GET" }
  );
  if(f.status == 200) {
      const json = await f.json();
      json.map(region => {
          let op = genOpt(region.name, region._id);
          document.querySelector('#region').append(op);
      })
  }
};

const submit = async () => {
    const e = fetch(
        "https://colectiva.com.ar:5050/docks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(getJSON())
        }
    );
    console.log(e);
    console.log(e.status);
};

