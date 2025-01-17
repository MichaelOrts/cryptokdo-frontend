import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useEffect, useState } from "react"

import { publicClientSepolia as publicClient } from "@/utils/client";
import { contractAddressHardhat, contractAddressSepolia, contractAbi } from "@/constant";

import {  useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { readContract, parseAbiItem, parseEther, formatEther } from "viem";

const CreatePrizePool = () => {

    const [receiver, setReceiver] = useState('');
    const [currentGiver, setCurrentGiver] = useState('');
    const [givers, setGivers] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contractAddress, setContractAddress] = useState(contractAddressSepolia)

    const { address, chain } = useAccount();

    const {data: hash, error, isPending: setIsPending, writeContract } = useWriteContract({
        /* mutation: {
             onSuccess: () => {
 
             },
             onError: (error) => {
 
             }
         }*/
     })

     const createPrizePool = async() => {
        await writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: 'createPrizePool',
            args: [receiver,givers,title,description]
        })
    }

    const handleAddGiver = () => {
        let newGivers = givers.slice();
        newGivers.push(currentGiver);
        setGivers(newGivers);
        setCurrentGiver('');
    }

    const handleRemoveGiver = (id) => {
        let newGivers = givers.slice();
        newGivers.splice(id,1);
        setGivers(newGivers);
    }

    const isAddress = (str) => {
        return new RegExp("0x[a-fA-F0-9]{40}$").test(str);
    }

    useEffect(() => {
      setContractAddress(chain?.name === "Hardhat" ? contractAddressHardhat : contractAddressSepolia)
    }, [chain])

    return (
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={!address}>Create Prize Pool</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader className="flex items-center">
              <DialogTitle>Create Prize Pool</DialogTitle>
              <DialogDescription>
                Create new Prize Pool. Click create when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-left">
                  Title :
                </Label>
                <Input id="title" defaultValue="" className="col-span-3" value={title} onChange={ e => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-left">
                  Description :
                </Label>
                <Input id="description" defaultValue="" className="col-span-3" value={description} onChange={ e => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receiver" className="text-left">
                  Receiver :
                </Label>
                <Input id="receiver" defaultValue="" className="col-span-3" value={receiver} onChange={ e => isAddress(e.target.value) && setReceiver(e.target.value)} />
              </div>
              <Label htmlFor="givers" className="text-center font-bold">
                  Givers
                </Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="giver" className="text-left">
                  Giver :
                </Label>
                <Input id="giver" defaultValue="" className="col-span-3" value={currentGiver} onChange={ e => isAddress(e.target.value) && setCurrentGiver(e.target.value)} />
              </div>
              <div>
                {givers.length > 0 && givers.map((giver, id) => {
                    return (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-left col-span-3">{giver}</Label>
                            <Button className="col-span-1" onClick={e => handleRemoveGiver(id)}>Remove</Button>
                        </div>
                    )
                })}
              </div>
              <Button className="justify-self-center" disabled={!currentGiver} onClick={handleAddGiver}>Add Giver</Button>
            </div>
            <DialogFooter className="grid grid-cols-1">
              <DialogClose type="submit" className="h-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!(receiver && givers.length > 0 && title != "")} onClick={createPrizePool}>Create</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
  }
  
  export default CreatePrizePool;
  