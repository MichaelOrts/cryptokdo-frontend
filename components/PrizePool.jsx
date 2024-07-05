import { useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddress, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { formatEther, parseEther } from "viem"

const PrizePool = ({data}) => {

    const [amount, setAmount] = useState(0);
    const [donateError, setDonateError] = useState(true);

    const { address } = useAccount();

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        /* mutation: {
             onSuccess: () => {
 
             },
             onError: (error) => {
 
             }
         }*/
     })

     const donate = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'donate',
            value: parseEther(amount.toString()),
            args: [data[1]]
        })
        setAmount(0)
    }

    const closePrizePool = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'closePrizePool',
            args: [data[1]]
        })
    }

    const isGiver = () => {
        return data[0].givers.find(giver => giver.toLowerCase() === address.toLowerCase())
    }

    return (
        <Card className="flex flex-col bg-gradient-to-b from-blue-500 to-purple-500">
            <CardHeader className="">
                <CardTitle>Prize Pool</CardTitle>
                <CardDescription>Prize Pool Description</CardDescription>
            </CardHeader>
            <CardContent className="">
                <p className="font-bold">Owner</p>
                <p className="text-right">{data[0].owner.toLowerCase()}</p>
                <p className="font-bold">Receiver</p>
                <p className="text-right">{data[0].receiver.toLowerCase()}</p>
                <p className="font-bold">Givers</p>
                {data[0].givers.length > 0 && data[0].givers.map((giver, id) => {
                    return (
                        <p className="text-right">{giver.toLowerCase()}</p>
                    )
                })}
                <p className="font-bold">Amount</p>
                <p className="text-right">{formatEther(data[0].amount)} ETH</p>
            </CardContent>
            <CardFooter className="h-full flex flex-col gap-2 flex-wrap place-content-end">
                {donateError && <p className="text-red-500 w-full">Amount must be greater than 0.003 ether</p>}
                <div className="flex flex-row flex-span w-full gap-2">
                    <Input id="amount" defaultValue="" className="w-full" type="number" value={amount} onChange={ e => setAmount(e.target.value) & setDonateError(e.target.value < 0.003)} />
                    <Button className="" disabled={!address || !isGiver() || donateError} onClick={donate}>Donate</Button>
                </div>
                <Button className="w-full" disabled={!address || address.toLowerCase() != data[0].owner.toLowerCase()} onClick={closePrizePool}>Close</Button>
            </CardFooter>
        </Card>
    );
  }
  
  export default PrizePool;
  