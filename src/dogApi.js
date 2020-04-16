export function createResource() {
  return wrapPromise(fetchDogs);
}

function fetchDogs(numDogs) {
  console.log("fetch dogs...");
  return fetch(
    "https://dogceo.netlify.com/.netlify/functions/pics?count=" + numDogs
  )
    .then(x => x.json())
    .then(y => y.map(x => x.toLowerCase()));
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let currentArg = null;
  let suspender = arg =>
    promise(arg).then(
      r => {
        status = "success";
        result = r;
      },
      e => {
        status = "error";
        result = e;
      }
    );
  return {
    read(arg) {
      if (currentArg !== arg) {
        status = "pending";
        currentArg = arg;
      }
      if (status === "pending") {
        throw suspender(arg);
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}