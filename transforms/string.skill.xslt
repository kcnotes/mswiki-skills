<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  
  <xsl:template match="/">
    <Skills>
      <xsl:apply-templates select="/dir/dir"/>
    </Skills>
  </xsl:template>
  
  <!-- Replace <dir name="3221014" with <Skill> -->
  <xsl:template match="/dir/dir">
    <xsl:element name="s_{@name}">
      <xsl:attribute name="id">
        <xsl:value-of select="@name"/>
      </xsl:attribute>
      <xsl:for-each select="string">
        <xsl:attribute name="{@name}">
          <xsl:value-of select="@value"/>
        </xsl:attribute>
      </xsl:for-each>
    </xsl:element>
  </xsl:template> 
</xsl:stylesheet>
