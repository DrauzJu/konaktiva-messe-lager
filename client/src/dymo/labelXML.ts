export default function getLabelXML(barcode: number, company: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <DesktopLabel Version="1">
      <DYMOLabel Version="3">
        <Description>DYMO Label</Description>
        <Orientation>Landscape</Orientation>
        <LabelName>StorageS0722440</LabelName>
        <InitialLength>0</InitialLength>
        <BorderStyle>SolidLine</BorderStyle>
        <DYMORect>
          <DYMOPoint>
            <X>0.22</X>
            <Y>0.05666666</Y>
          </DYMOPoint>
          <Size>
            <Width>2.47</Width>
            <Height>2.03</Height>
          </Size>
        </DYMORect>
        <BorderColor>
          <SolidColorBrush>
            <Color A="1" R="0" G="0" B="0"> </Color>
          </SolidColorBrush>
        </BorderColor>
        <BorderThickness>1</BorderThickness>
        <Show_Border>False</Show_Border>
        <DynamicLayoutManager>
          <RotationBehavior>ClearObjects</RotationBehavior>
          <LabelObjects>
            <BarcodeObject>
              <Name>Barcode</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="1" R="1" G="1" B="1"> </Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <BarcodeFormat>Code39</BarcodeFormat>
              <Data>
                <MultiDataString>
                  <DataString>${barcode}</DataString>
                </MultiDataString>
              </Data>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Middle</VerticalAlignment>
              <Size>Medium</Size>
              <TextPosition>Bottom</TextPosition>
              <FontInfo>
                <FontName>Arial</FontName>
                <FontSize>16</FontSize>
                <IsBold>False</IsBold>
                <IsItalic>False</IsItalic>
                <IsUnderline>False</IsUnderline>
                <FontBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </FontBrush>
              </FontInfo>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.2291851</X>
                  <Y>0.5335547</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.372787</Width>
                  <Height>1.169515</Height>
                </Size>
              </ObjectLayout>
            </BarcodeObject>
            <TextObject>
              <Name>Text</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"> </Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"> </Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Top</VerticalAlignment>
              <FitMode>AlwaysFit</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>AlwaysFit</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Top</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>konaktiva 2025</Text>
                    <FontInfo>
                      <FontName>Arial</FontName>
                      <FontSize>24.5</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"> </Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.2291851</X>
                  <Y>0.123346</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.373602</Width>
                  <Height>0.4102086</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
            <TextObject>
              <Name>Text1</Name>
              <Brushes>
                <BackgroundBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"> </Color>
                  </SolidColorBrush>
                </BackgroundBrush>
                <BorderBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </BorderBrush>
                <StrokeBrush>
                  <SolidColorBrush>
                    <Color A="1" R="0" G="0" B="0"> </Color>
                  </SolidColorBrush>
                </StrokeBrush>
                <FillBrush>
                  <SolidColorBrush>
                    <Color A="0" R="1" G="1" B="1"> </Color>
                  </SolidColorBrush>
                </FillBrush>
              </Brushes>
              <Rotation>Rotation0</Rotation>
              <OutlineThickness>1</OutlineThickness>
              <IsOutlined>False</IsOutlined>
              <BorderStyle>SolidLine</BorderStyle>
              <Margin>
                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
              </Margin>
              <HorizontalAlignment>Center</HorizontalAlignment>
              <VerticalAlignment>Top</VerticalAlignment>
              <FitMode>AlwaysFit</FitMode>
              <IsVertical>False</IsVertical>
              <FormattedText>
                <FitMode>AlwaysFit</FitMode>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Top</VerticalAlignment>
                <IsVertical>False</IsVertical>
                <LineTextSpan>
                  <TextSpan>
                    <Text>${company.substring(0, 15)}</Text>
                    <FontInfo>
                      <FontName>Arial</FontName>
                      <FontSize>17.9</FontSize>
                      <IsBold>False</IsBold>
                      <IsItalic>False</IsItalic>
                      <IsUnderline>False</IsUnderline>
                      <FontBrush>
                        <SolidColorBrush>
                          <Color A="1" R="0" G="0" B="0"> </Color>
                        </SolidColorBrush>
                      </FontBrush>
                    </FontInfo>
                  </TextSpan>
                </LineTextSpan>
              </FormattedText>
              <ObjectLayout>
                <DYMOPoint>
                  <X>0.2291851</X>
                  <Y>1.753924</Y>
                </DYMOPoint>
                <Size>
                  <Width>2.373602</Width>
                  <Height>0.2919092</Height>
                </Size>
              </ObjectLayout>
            </TextObject>
          </LabelObjects>
        </DynamicLayoutManager>
      </DYMOLabel>
      <LabelApplication>Blank</LabelApplication>
      <DataTable>
        <Columns> </Columns>
        <Rows> </Rows>
      </DataTable>
    </DesktopLabel>
    `.replaceAll("><", "> <"); // Fix DYMO bug :(
}
