import os
import torch
import numpy as np
import open3d as o3d
import locale  
import sys
import cv2
from PIL import Image
import trimesh
import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="timm.models.layers")

sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale = locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

midas = torch.hub.load("intel-isl/MiDaS", "DPT_Large")
midas.to("cpu").eval()

midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms")
transform = midas_transforms.dpt_transform

def convert_ply_to_glb(ply_path, glb_path):
    mesh = trimesh.load(ply_path)
    mesh.export(glb_path)

def convert_ply_to_gltf(ply_path, gltf_path):
    mesh = trimesh.load(ply_path)
    mesh.export(gltf_path)

if __name__ == "__main__":
    image_path = "python/uploads/image.jpg"
    if os.path.exists(image_path):
        image = Image.open(image_path).convert("RGB")
        image = image.resize((int(image.width * 1.5), int(image.height * 1.5)))
        image_np = np.array(image)

        transformed = transform(image_np)
        input_tensor = transformed["image"] if isinstance(transformed, dict) else transformed

        with torch.no_grad():
            prediction = midas(input_tensor)[0]
        depth_map = prediction.squeeze().cpu().numpy()
        depth_map = cv2.resize(depth_map, (image_np.shape[1], image_np.shape[0]))
        depth_map = cv2.bilateralFilter(depth_map.astype(np.float32), d=9, sigmaColor=75, sigmaSpace=75)

        depth_min, depth_max = np.min(depth_map), np.max(depth_map)
        depth_vis = (255 * (depth_map - depth_min) / (depth_max - depth_min)).astype("uint8")

        h, w = depth_map.shape
        fx = fy = max(w, h)
        cx, cy = w / 2, h / 2
        points = []
        colors = []

        step = 1
        for y in range(0, h, step):
            for x in range(0, w, step):
                Z = depth_map[y, x]
                if Z <= 0:
                    continue
                X = (x - cx) * Z / fx
                Y = (y - cy) * Z / fy
                points.append([X, Y, Z])
                colors.append(image_np[y, x] / 255.0)

        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(np.array(points))
        pcd.colors = o3d.utility.Vector3dVector(np.array(colors))
        pcd, _ = pcd.remove_statistical_outlier(nb_neighbors=30, std_ratio=2.0)
        
        ply_output_path = "public/point_cloud.ply"
        glb_output_path = "public/point_cloud.glb"
        gltf_output_path = "public/point_cloud.gltf"

        o3d.io.write_point_cloud(ply_output_path, pcd)

        convert_ply_to_glb(ply_output_path, glb_output_path)
        convert_ply_to_gltf(ply_output_path, gltf_output_path)
        print("✅ Point cloud generated successfully!")
    else:
        print(f"❌ Image not found: {image_path}")
        print("Please upload an image named 'image.jpg' in the 'python/uploads/' folder.")
