import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Switch } from '../../../components/ui/switch';
import { Checkbox } from '../../../components/ui/checkbox';


const NFTListing = () => {
  const [imageFile, setImageFile] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const handleImageUpload = (e) => {
    const file = e.target.files[0] || e.target.value;
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
  
      img.onload = () => {
        setImageFile({
          file: file,
          width: img.width,
          height: img.height,
        });
      };
    };
  
    reader.readAsDataURL(file);
  };
  

  const [unlockableContentEnabled, setUnlockableContentEnabled] = useState(false);
  const [explicitContentEnabled, setExplicitContentEnabled] = useState(false);



  return (
    <div className="mt-[135px] mb-[100px]">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit("")} className="space-y-8">
          {/* Main Image/Artwork */}
          <div className="relative h-64 w-full">
      {imageFile ? (
        <img
          src={URL.createObjectURL(imageFile.file)}
          alt="Uploaded NFT"
          style={{ width: "275px", height: "275px", display: "inline-block", float: "left" }}
          className="rounded-md mx-auto"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span>Drag and drop your NFT image here or click to browse.</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
          {/* NFT Details */}
          <div className="space-y-4">
            <label htmlFor="title" className="block text-gray-700 ">
              Item Name
            </label>
            <input
              type="text"
              placeholder="NFT Title"
              {...register("nftName", { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.nftName && (
              <span className="text-red-500">NFT Name is required</span>
            )}

            {/* Price/Auction/Offer Options */}
            <div className="flex items-center space-x-4">
              <input
                type="number"
                placeholder="Fixed Price in ETH"
                {...register("fixedPrice", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Auction Starting Price"
                {...register("auctionPrice", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="checkbox"
                {...register("acceptOffers", { required: false })}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="flex-none">Accept Offers</span>
            </div>
            <div className="space-y-2">
              {/* Description */}
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <span className="text-gray-500 text-sm">
                The description will be included on the item's detail page
                underneath its image.
              </span>
              <input
                type="text"
                id="description"
                placeholder="Description"
                {...register("description", { required: false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* External Link */}
            <div className="space-y-2">
              <label htmlFor="externalLink" className="block text-gray-700">
                External Link
              </label>
              <span className="text-gray-500 text-sm">
                Artify will include a link to this URL on this item's detail
                page, so that users can click to learn more about it. You are
                welcome to link to your own webpage with more details.
              </span>
              <input
                type="text"
                id="externalLink"
                placeholder="External Link"
                {...register("externalLink", { required: false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Check Boxes */}
            <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          {...register("unlockableContent", { required: false })}
          className="form-checkbox h-4 w-4  checked:bg-black"
          onChange={(e) => setUnlockableContentEnabled(e.target.checked)}
        />
        <div>
          <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Unlockable Content</span>
          <p className="text-gray-500 text-sm">Include unlockable content that can only be revealed by the owner of the item.</p>
        </div>
      </div>
      {unlockableContentEnabled && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter content (access key, code to redeem, link to a file, etc.)"
            {...register("unlockableContentData", { required: false })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
          />
        </div>
      )}

            <div className="flex items-center space-x-4">
              <Checkbox
                id="explicitContent"
                onChange={() =>
                  setExplicitContentEnabled(!explicitContentEnabled)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="unlockableContent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Explicit & Sensitive Content
                </label>
                <p className="text-gray-500 text-sm">
                  Set this item as explicit and sensitive content.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default NFTListing