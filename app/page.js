'use client'

import CryptoKDO from "@/components/CryptoKDO"
import NotConnected from "@/components/NotConnected";

import { useAccount } from "wagmi";

export default function Home() {

  const { isConnected } = useAccount()

  return (
    <>
      { isConnected ? (
        <CryptoKDO />
      ) : (
        <NotConnected />
      )}
    </>
  );
}
