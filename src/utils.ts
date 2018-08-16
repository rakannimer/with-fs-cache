export const isPromise = (promiseMaybe: any) => {
  return (
    !!promiseMaybe &&
    (typeof promiseMaybe === "object" || typeof promiseMaybe === "function") &&
    typeof promiseMaybe.then === "function"
  );
};
