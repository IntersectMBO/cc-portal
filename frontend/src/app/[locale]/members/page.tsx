import { Loading } from "@molecules";
import { Suspense } from "react";

export default async function Members() {
  return <Suspense fallback={<Loading />}></Suspense>;
}
