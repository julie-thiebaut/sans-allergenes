import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImageWithPlaceholder } from "../../src/components/common/ImageWithPlaceholder";

describe("ImageWithPlaceholder", () => {
  it("shows the photo when the restaurant has one", () => {
    render(<ImageWithPlaceholder src="https://example.test/salle.jpg" alt="Chez Test" />);
    const image = screen.getByRole("img", { name: "Chez Test" });
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "https://example.test/salle.jpg");
  });

  it("shows the placeholder when there is no photo", () => {
    render(<ImageWithPlaceholder alt="Chez Test" />);
    const placeholder = screen.getByRole("img", { name: "Chez Test" });
    expect(placeholder.tagName).toBe("DIV");
  });

  it("falls back to the placeholder when the photo fails to load", () => {
    render(<ImageWithPlaceholder src="https://example.test/disparue.jpg" alt="Chez Test" />);
    fireEvent.error(screen.getByRole("img", { name: "Chez Test" }));

    const placeholder = screen.getByRole("img", { name: "Chez Test" });
    expect(placeholder.tagName).toBe("DIV");
    expect(document.querySelector("img")).toBeNull();
  });

  it("tries again when the photo changes after a failure", () => {
    const { rerender } = render(
      <ImageWithPlaceholder src="https://example.test/disparue.jpg" alt="Chez Test" />,
    );
    fireEvent.error(screen.getByRole("img", { name: "Chez Test" }));
    expect(document.querySelector("img")).toBeNull();

    rerender(<ImageWithPlaceholder src="https://example.test/nouvelle.jpg" alt="Chez Test" />);
    expect(screen.getByRole("img", { name: "Chez Test" }).tagName).toBe("IMG");
  });
});
