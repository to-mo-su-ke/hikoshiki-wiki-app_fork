from PIL import Image, ImageDraw

# 元の画像を開く
input_image_path = "input.png"  # 元の画像のパス
output_image_path = "output_with_dot.png"  # 出力画像のパス

# 画像を開く
image = Image.open(input_image_path)

# 描画用オブジェクトを作成
draw = ImageDraw.Draw(image)

# 赤いドットの位置とサイズを指定
dot_radius = 10  # ドットの半径
dot_position = (image.width - 20, 20)  # 右上に配置 (調整可能)

# 赤いドットを描画
draw.ellipse(
    [
        (dot_position[0] - dot_radius, dot_position[1] - dot_radius),
        (dot_position[0] + dot_radius, dot_position[1] + dot_radius),
    ],
    fill="red",
)

# 画像を保存
image.save(output_image_path)
print(f"赤いドットを追加した画像を保存しました: {output_image_path}")