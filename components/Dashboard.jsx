import { useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWaitForTransactionReceipt } from "wagmi";

import { formatEther, parseEther } from "viem"

const Dashboard = ({totalPrizePools, totalSupply}) => {

    const { address } = useAccount();

    return (
        <Card className="flex flex-col bg-gradient-to-b from-green-500 to-yellow-500">
            <CardHeader className="">
                <CardTitle>Dashboard</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="">
                <p className="font-bold">Open Prize Pools</p>
                <p className="text-right font-bold">{totalPrizePools.toString()}</p>
                <p className="font-bold">Supply Deposited</p>
                <p className="text-right font-bold">{formatEther(totalSupply)} ETH</p>
            </CardContent>
            <CardFooter className="h-full flex flex-col gap-2 flex-wrap place-content-end">
            </CardFooter>
        </Card>
    );
  }
  
  export default Dashboard;
  