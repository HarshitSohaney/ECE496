# Unity Assets

The documentation denotes the 3D asset creation process and the customizable attributes of assets can be found at https://docs.google.com/document/d/1-04Sdj6Iiy4hr_A1VQZs9cwKz8sXaT7OZqF9iIykMGo/edit?usp=sharing.

## When to use Unity for Asset Creation 
Use unity to create 3D models or assets. For any complex models/assets, it would be best to create in a separate software such as Maya or Blender and then import it into Unity to adjust the appearance.

## Purpose of Unity 
Unity should be used to create custom models and/or scenes. Once done, it needs to be converted to a glft file to be used in A-Frame. Note: When the glft files are converted, additional files may be created as well depending on the 3D asset. For example, a specific texture may require a image reference. All the additional files are dependancies that should be loaded in the code.  

## Purpose of A-Frame
A-Frame should be used to create the AR interface and to handle the interactions. Since A-Frame requires GLFT files, it difficult to handle the interactions with using the Unity Script. The converted GLFT files can be found in UnityAssets/Assets/ObjectFiles/
